import path from 'path';
import { GatsbyNode, CreatePagesArgs } from 'gatsby';
import { Document } from '@friends-library/friends';
import { documentUrl, friendUrl } from '../lib/url';
import { allFriends } from './helpers';

const FriendPage = path.resolve('./src/templates/FriendPage.tsx');
const DocumentPage = path.resolve('./src/templates/DocumentPage.tsx');

const createPagesStatefully: GatsbyNode['createPagesStatefully'] = ({
  actions: { createPage },
}: CreatePagesArgs) => {
  allFriends().forEach(friend => {
    createPage({
      path: friendUrl(friend),
      component: FriendPage,
      context: {
        slug: friend.slug,
      },
    });

    friend.documents.forEach((document: Document) => {
      createPage({
        path: documentUrl(document),
        component: DocumentPage,
        context: {
          friendSlug: friend.slug,
          documentSlug: document.slug,
        },
      });
    });
  });
};

export default createPagesStatefully;