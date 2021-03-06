import path from 'path';
import { GatsbyNode, CreatePagesArgs } from 'gatsby';
import { Document, allFriends } from '@friends-library/friends';
import { documentUrl, friendUrl } from '../lib/url';
import { LANG } from '../env';

const FriendPage = path.resolve(`./src/templates/FriendPage.tsx`);
const DocumentPage = path.resolve(`./src/templates/DocumentPage.tsx`);

const createPagesStatefully: GatsbyNode['createPagesStatefully'] = ({
  actions: { createPage },
}: CreatePagesArgs) => {
  allFriends()
    .filter((f) => f.lang === LANG)
    .filter((f) => f.hasNonDraftDocument)
    .forEach((friend) => {
      createPage({
        path: friend.isCompilationsQuasiFriend ? friend.slug : friendUrl(friend),
        component: FriendPage,
        context: {
          slug: friend.slug,
          relatedDocumentIds: friend.relatedDocuments.map((rd) => rd.id),
        },
      });

      friend.documents
        .filter((d) => d.hasNonDraftEdition)
        .forEach((document: Document) => {
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
