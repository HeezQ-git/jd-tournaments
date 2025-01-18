import ManageTournament from '@/components/User/Tournaments/ManageTournament/ManageTournament';
import { setPageTitle } from '@/utils/setPageTitle';
import React from 'react';

export async function generateMetadata() {
  return setPageTitle('tournament.create');
}

const CreateTournamentPage = () => <ManageTournament />;

export default CreateTournamentPage;
