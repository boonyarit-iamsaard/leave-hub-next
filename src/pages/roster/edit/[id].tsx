import type { GetServerSideProps, NextPage } from 'next';

import { sessionGuard } from '../../../guards/session.guard';

const EditPage: NextPage = () => {
  return <div>EditPage</div>;
};

export default EditPage;

export const getServerSideProps: GetServerSideProps = sessionGuard(
  // TODO: Fix eslint warning
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async ctx => {
    return {
      props: {},
    };
  }
);
