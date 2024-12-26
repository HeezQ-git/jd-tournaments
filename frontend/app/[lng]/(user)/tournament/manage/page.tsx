import CreateTournament from '@/components/User/Tournaments/CreateTournament/CreateTournament';
import { setPageTitle } from '@/utils/setPageTitle';
import React from 'react';

export async function generateMetadata() {
  return setPageTitle('tournament.create');
}

const CreateTournamentPage = () => <CreateTournament />;

export default CreateTournamentPage;
