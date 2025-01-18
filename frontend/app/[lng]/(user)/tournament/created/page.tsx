import CreatedTournaments from '@/components/User/Tournaments/CreatedTournaments/CreatedTournaments';
import { setPageTitle } from '@/utils/setPageTitle';
import React from 'react';

export async function generateMetadata() {
  return setPageTitle('tournament.created');
}

const CreatedTournamentsPage = () => <CreatedTournaments />;

export default CreatedTournamentsPage;
