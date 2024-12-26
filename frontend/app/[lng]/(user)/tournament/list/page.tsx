import TournamentList from '@/components/User/Tournaments/TournamentList/TournamentList';
import { setPageTitle } from '@/utils/setPageTitle';
import React from 'react';

export async function generateMetadata() {
  return setPageTitle('tournament.list');
}

const TournamentListPage = () => <TournamentList />;

export default TournamentListPage;
