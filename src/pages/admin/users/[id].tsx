import { useEffect } from 'react';

import {
  Button,
  Center,
  Container,
  Flex,
  Grid,
  Loader,
  NumberInput,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import type { Entitlement, User } from '@prisma/client';
import { Role, Roster } from '@prisma/client';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import { trpc } from '../../../utils/trpc';

const initialValues: Pick<
  User,
  'name' | 'username' | 'email' | 'role' | 'roster'
> & {
  entitlements: Entitlement[];
} = {
  name: '',
  username: '',
  email: '',
  role: Role.USER,
  roster: Roster.MECHANIC,
  entitlements: [],
};

const onSuccessNotification = (message?: string) =>
  showNotification({
    color: 'green',
    title: 'Success',
    message: message ? message : 'User information updated successfully',
  });

const UserDetail = () => {
  const router = useRouter();
  // TODO: Improve this type assertion
  const id = router.query.id as string;

  const { data: sessionData } = useSession();
  const { data: userData, isLoading: loading } = trpc.user.fineOneById.useQuery(
    { id },
    { enabled: sessionData?.user !== undefined }
  );

  const form = useForm({
    initialValues,
  });
  const userUpdateMutation = trpc.user.update.useMutation({
    async onSuccess() {
      onSuccessNotification();
    },
  });
  const entitlementUpdateMutation = trpc.entitlement.update.useMutation({
    async onSuccess() {
      onSuccessNotification();
    },
  });
  const entitlementCreateMutation = trpc.entitlement.create.useMutation({
    async onSuccess() {
      onSuccessNotification();
    },
  });
  const entitlementDeleteMutation = trpc.entitlement.delete.useMutation({
    async onSuccess() {
      onSuccessNotification('Entitlement deleted successfully');
    },
  });

  const handleDeleteEntitlement = async (index: number) => {
    const entitlement = form.values.entitlements[index];

    if (!entitlement?.id) {
      form.removeListItem('entitlements', index);
      return;
    } else {
      await entitlementDeleteMutation.mutateAsync({ id: entitlement.id });
      form.removeListItem('entitlements', index);
    }
  };

  const handleSubmit = async () => {
    if (!userData) return;

    await userUpdateMutation.mutateAsync({
      id: userData.id,
      name: form.values.name,
      username: form.values.username,
      email: form.values.email,
      role: form.values.role,
      roster: form.values.roster,
    });

    await Promise.all(
      form.values.entitlements.map(entitlement => {
        if (entitlement.id) {
          entitlementUpdateMutation.mutateAsync({
            id: entitlement.id,
            year: entitlement.year,
            name: entitlement.name,
            amount: entitlement.amount,
          });
        } else {
          entitlementCreateMutation.mutateAsync({
            year: entitlement.year,
            name: entitlement.name,
            amount: entitlement.amount,
            userId: userData.id,
          });
        }
      })
    );

    form.reset();
    router.back();
  };

  useEffect(() => {
    if (userData) {
      form.setValues({
        name: userData.name,
        username: userData.username,
        email: userData.email,
        role: userData.role,
        roster: userData.roster,
        entitlements: userData.entitlements,
      });
    }
    // TODO: Fix dependency warning if set form state in useEffect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  return (
    <Container size="xs" p={0}>
      {loading ? (
        <Center>
          <Loader variant="dots" sx={{ marginInline: 'auto' }} />
        </Center>
      ) : userData ? (
        <Stack>
          <Title order={1}>{userData.name}</Title>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <Text>User Information</Text>
              <TextInput
                label="Name"
                value={form.values.name}
                onChange={event =>
                  form.setFieldValue('name', event.currentTarget.value)
                }
              />
              <TextInput
                label="Username"
                value={form.values.username}
                onChange={event =>
                  form.setFieldValue('username', event.currentTarget.value)
                }
              />
              <TextInput
                label="Email"
                value={form.values.email}
                onChange={event =>
                  form.setFieldValue('email', event.currentTarget.value)
                }
              />
              <Select
                label="Role"
                value={form.values.role}
                onChange={role =>
                  form.setFieldValue('role', Role[role as keyof typeof Role])
                }
                data={[
                  { value: Role.ADMIN, label: 'Admin' },
                  { value: Role.USER, label: 'User' },
                ]}
              />
              <Select
                label="Roster"
                value={form.values.roster}
                onChange={roster =>
                  form.setFieldValue(
                    'roster',
                    Roster[roster as keyof typeof Roster]
                  )
                }
                data={[
                  { value: Roster.ENGINEER, label: 'Engineer' },
                  { value: Roster.MECHANIC, label: 'Mechanic' },
                ]}
              />

              <Text>Entitlements</Text>
              {form.values.entitlements.length > 0 ? (
                form.values.entitlements.map((entitlement, index) => (
                  <Grid gutter="md" key={index}>
                    <Grid.Col span={4}>
                      <NumberInput
                        label="Year"
                        {...form.getInputProps(`entitlements.${index}.year`)}
                      />
                    </Grid.Col>
                    <Grid.Col span={4}>
                      {/* TODO: Implement select input */}
                      <TextInput
                        label="Entitlement"
                        {...form.getInputProps(`entitlements.${index}.name`)}
                      />
                    </Grid.Col>
                    <Grid.Col span={4}>
                      <NumberInput
                        label="Amount"
                        {...form.getInputProps(`entitlements.${index}.amount`)}
                      />
                    </Grid.Col>
                    <Grid.Col>
                      <Flex justify="flex-start" gap="md">
                        <Button
                          variant="subtle"
                          color="red"
                          onClick={() => handleDeleteEntitlement(index)}
                        >
                          Remove
                        </Button>
                        {index === form.values.entitlements.length - 1 && (
                          <Button
                            variant="light"
                            color="blue"
                            onClick={() =>
                              form.insertListItem('entitlements', {
                                year: dayjs().year(),
                                name: '',
                                amount: 0,
                                userId: userData.id,
                              })
                            }
                          >
                            Add
                          </Button>
                        )}
                      </Flex>
                    </Grid.Col>
                  </Grid>
                ))
              ) : (
                <Button
                  color="blue"
                  variant="outline"
                  onClick={() =>
                    form.insertListItem('entitlements', {
                      year: dayjs().year(),
                      name: '',
                      amount: 0,
                      userId: userData.id,
                    })
                  }
                >
                  Add Entitlement
                </Button>
              )}

              <Flex justify="flex-end" gap="md">
                <Button color="red" variant="outline" onClick={router.back}>
                  Cancle
                </Button>
                <Button type="submit" color="blue">
                  Update
                </Button>
              </Flex>
            </Stack>
          </form>
        </Stack>
      ) : (
        // TODO: Implement not found component
        <p>User not found</p>
      )}
    </Container>
  );
};

export default UserDetail;
