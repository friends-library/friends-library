import kiteCheck from '../check/kite';
import lintCheck from '../check/lint';
import { prTestSetup } from './helpers';
import pullRequest from '../pull-request';

jest.mock('../check/kite');
jest.mock('../check/lint');

describe('pullRequest()', () => {
  let payload;
  let github;
  let context;

  beforeEach(() => {
    [context, github, payload] = prTestSetup();
  });

  it('ignores PR opened on monorepo', async () => {
    payload.repository.name = 'friends-library';
    await pullRequest(context);
    expect(github.checks.create).not.toHaveBeenCalled();
    expect(kiteCheck).not.toHaveBeenCalled();
    expect(lintCheck).not.toHaveBeenCalled();
  });

  it('requests modified files for PR', async () => {
    await pullRequest(context);
    expect(github.pullRequests.listFiles).toHaveBeenCalledWith({
      owner: 'friends-library-sandbox',
      repo: 'jane-doe',
      number: 11,
    });
  });

  it('fetches file content for PR modified files', async () => {
    await pullRequest(context);
    expect(github.repos.getContents).toHaveBeenCalledWith({
      owner: 'friends-library-sandbox',
      repo: 'jane-doe',
      path: '01.adoc',
      ref: '2d306bb70578e6c019e3579c02d4f78f17bf915e',
    });
  });

  it('passes fetched files to lint and kite checks', async () => {
    const files = [{ path: '01.adoc', adoc: '== Ch 1' }];
    await pullRequest(context);
    expect(lintCheck).toHaveBeenCalledWith(context, files);
    expect(kiteCheck).toHaveBeenCalledWith(context, files);
  });
});
