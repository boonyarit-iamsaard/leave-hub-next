import { useEffect, useState } from 'react';

import type { Entitlement } from '@prisma/client';
import { ShiftPriority, ShiftType } from '@prisma/client';
import { useSession } from 'next-auth/react';

import { trpc } from '../utils/trpc';

// TODO: Move to a types directory
export interface ProfileSummary {
  priority: ShiftPriority;
  type: ShiftType;
  count: number;
  sum: number;
}

export const useProfileSummary = (year: string) => {
  const { data: sessionData } = useSession();
  const { data: summaryData, isLoading: loadingSummary } =
    trpc.shift.getUsageSummary.useQuery(
      { year },
      { enabled: sessionData?.user !== undefined }
    );
  const { data: profileData, isLoading: loadingProfile } =
    trpc.user.profile.useQuery(undefined, {
      enabled: sessionData?.user !== undefined,
    });

  const [entitlements, setEntitlements] = useState<Entitlement[]>([]);
  const [used, setUsed] = useState<number>(0);
  const [summary, setSummary] = useState<ProfileSummary[]>([]);
  const [hasANL1, setHasANL1] = useState<boolean>(false);
  const [hasANL2, setHasANL2] = useState<boolean>(false);

  useEffect(() => {
    if (summaryData) {
      const serializedSummary = summaryData.map(item => ({
        priority: item.priority,
        type: item.type,
        count: item._count.priority,
        sum: item._sum.amount ? item._sum.amount : 0,
      }));

      const hasANL1 = serializedSummary.some(
        item => item.priority === ShiftPriority.ANL1 && item.count > 0
      );
      const hasANL2 = serializedSummary.some(
        item => item.priority === ShiftPriority.ANL2 && item.count > 0
      );
      const used = serializedSummary
        .filter(item => item.type === ShiftType.LEAVE)
        .reduce((acc, item) => acc + item.sum, 0);

      setSummary(serializedSummary);
      setHasANL1(hasANL1);
      setHasANL2(hasANL2);
      setUsed(used);
    }
  }, [summaryData]);

  useEffect(() => {
    if (profileData) {
      const entitlements = profileData.entitlements.filter(
        entitlement => entitlement.year === parseInt(year)
      );

      setEntitlements(entitlements);
    }
  }, [profileData, year]);

  return {
    entitlements,
    hasANL1,
    hasANL2,
    loadingProfile,
    loadingSummary,
    summary,
    used,
  };
};
