import CreateTournament from '@/components/User/Tournaments/CreateTournament/CreateTournament';
import { setPageTitle } from '@/utils/setPageTitle';
import React from 'react';

export async function generateMetadata() {
  return setPageTitle('tournament.create');
}

const CreateTournamentPage = ({
  params: { id },
}: {
  params: { id: string };
}) => <CreateTournament id={id} />;

export default CreateTournamentPage;
