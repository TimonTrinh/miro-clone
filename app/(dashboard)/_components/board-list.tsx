import React from 'react'
import { EmptySearch } from './empty-search';
import { EmptyFavorites } from './empty-favorites';
import { EmptyBoard } from './empty-board';

interface BoardListProps {
    orgId: string,
    query: {
        search?: string,
        favorites?: string,
    }
}

export const BoardList = ({
    orgId,
    query,
}: BoardListProps) => {

    const data = []; //TODO: change to API data
    if (!data?.length && query.search) {
        return (
            <EmptySearch />
            // <div>Not found, try something else!</div>
        );
    }
    if (!data?.length && query.favorites) {
        return (
            <EmptyFavorites />
            // <div>No favorites!</div>
        );
    }
    if (!data?.length) {
        return (
            <EmptyBoard />
        );
    }

    return (
        <div>
            {JSON.stringify(query)}
        </div>
    );
}