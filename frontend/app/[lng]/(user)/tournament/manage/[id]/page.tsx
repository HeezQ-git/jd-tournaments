import ManageTournament from '@/components/User/Tournaments/ManageTournament/ManageTournament';
import { setPageTitle } from '@/utils/setPageTitle';
import React from 'react';

export async function generateMetadata() {
  return setPageTitle('tournament.manage');
}

const ManageTournamentPage = ({
  params: { id },
}: {
  params: { id: string };
}) => <ManageTournament id={id} />;

export default ManageTournamentPage;
