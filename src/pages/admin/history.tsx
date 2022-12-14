import type { GetServerSideProps, NextPage } from 'next';
import { adminGuard } from '../../guards/admin.guard';

const History: NextPage = () => {
  return <div>History</div>;
};

export default History;

// TODO: Fix eslint warning
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getServerSideProps: GetServerSideProps = adminGuard(async ctx => ({
  props: {},
}));
