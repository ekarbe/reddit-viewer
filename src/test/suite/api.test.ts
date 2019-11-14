import * as assert from 'assert';

import * as api from '../../model/reddit';

import { IAPIData, ITrendsResult, IGenericResult, ISubredditAbout, IListing, IArticle, IComment, IUserAbout, IMulti, ISubredditSearchResult } from '../../interfaces';

/**
 * API testing suite.
 * 
 * @category Test
 */
suite('API Test Suite', () => {

	/**
	 * Testing the resolved result of `getSubredditTrend`.
	 * 
	 * @category Test - API
	 */
	test('getSubredditTrend result test', async () => {
		let data: IAPIData = {};
		let result: ITrendsResult = await api.getSubredditTrend(data);
		assert.notEqual(undefined, result.comment_count);
		assert.notEqual(undefined, result.comment_url);
		assert.equal(5, result.subreddit_names.length);
	});

	/**
	 * Testing the rejection of `getSubredditDetail`.
	 * 
	 * @category Test - API
	 */
	test('getSubredditDetail rejected test', async () => {
		let data: IAPIData = {};
		let rejected: Promise<IGenericResult<ISubredditAbout>> = api.getSubredditDetail(data);
		assert.rejects(rejected);
		rejected.catch(err => {
			assert.equal("Error: required params are missing!\nsubreddit\n", err);
		});
	});

	/**
	 * Testing the resolved result of `getSubredditDetail`.
	 * 
	 * @category Test - API
	 */
	test('getSubredditDetail result test', async () => {
		let data: IAPIData = {
			subreddit: "reddit.com"
		};
		let result: IGenericResult<ISubredditAbout> = await api.getSubredditDetail(data);
		assert.equal("t5", result.kind);
		assert.notEqual(undefined, result.data);
		assert.equal("6", result.data.id);
		assert.notEqual(undefined, result.data.created);
	});

	/**
	 * Testing the rejection of `getSubredditArticle`.
	 * 
	 * @category Test - API
	 */
	test('getSubredditArticle rejected test', async () => {
		let data: IAPIData = {};
		let rejected: Promise<IGenericResult<IListing<IArticle>>> = api.getSubredditArticle(data);
		assert.rejects(rejected);
		rejected.catch(err => {
			assert.equal("Error: required params are missing!\nsubreddit\n", err);
		});
	});

	/**
	 * Testing the resolved result of `getSubredditArticle`.
	 * 
	 * @category Test - API
	 */
	test('getSubredditArticle result test', async () => {
		let data: IAPIData = {
			subreddit: "reddit.com"
		};
		let result: IGenericResult<IListing<IArticle>> = await api.getSubredditArticle(data);
		assert.equal("Listing", result.kind);
		assert.notEqual(undefined, result.data);
		assert.equal(25, result.data.children.length);
	});

	/**
	 * Testing the limit option of `getSubredditArticle`.
	 * 
	 * @category Test - API
	 */
	test('getSubredditArticle limit test', async () => {
		let data: IAPIData = {
			subreddit: "reddit.com",
			limit: 10,
		};
		let result: IGenericResult<IListing<IArticle>> = await api.getSubredditArticle(data);
		assert.equal("Listing", result.kind);
		assert.notEqual(undefined, result.data);
		assert.equal(10, result.data.children.length);
	});

	/**
	 * Testing the rejection of `getArticleDetail`.
	 * 
	 * @category Test - API
	 */
	test('getArticleDetail  rejected test', async () => {
		let data: IAPIData = {};
		let rejected: Promise<[IGenericResult<IListing<IArticle>>, IGenericResult<IListing<IComment>>]> = api.getArticleDetail(data);
		assert.rejects(rejected);
		rejected.catch(err => {
			assert.equal("Error: required params are missing!\nsubreddit\narticle_id\n", err);
		});

		data = {
			subreddit: "reddit.com"
		};
		rejected = api.getArticleDetail(data);
		assert.rejects(rejected);
		rejected.catch(err => {
			assert.equal("Error: required params are missing!\narticle_id\n", err);
		});
	});

	/**
	 * Testing the resolved result of `getArticleDetail`.
	 * 
	 * @category Test - API
	 */
	test('getArticleDetail result test', async () => {
		let data: IAPIData = {
			subreddit: "reddit.com",
			article_id: "lghsk"
		};
		let result: [IGenericResult<IListing<IArticle>>, IGenericResult<IListing<IComment>>] = await api.getArticleDetail(data);
		assert.equal("Listing", result[0].kind);
		assert.equal("Listing", result[1].kind);
		assert.notEqual(undefined, result[0].data);
		assert.notEqual(undefined, result[1].data);
		assert.equal(1, result[0].data.children.length);
		assert.equal("t3", result[0].data.children[0].kind);
		assert.equal("t1", result[1].data.children[0].kind);
	});

	/**
	 * Testing the rejection of `getArticleComment`.
	 * 
	 * @category Test - API
	 */
	test('getArticleComment rejected test', async () => {
		let data: IAPIData = {};
		let rejected: Promise<[IGenericResult<IListing<IArticle>>, IGenericResult<IListing<IComment>>]> = api.getArticleComment(data);
		assert.rejects(rejected);
		rejected.catch(err => {
			assert.equal("Error: required params are missing!\nsubreddit\narticle_id\ncomment_id\n", err);
		});
	});

	/**
	 * Testing the resolved result of `getArticleComment`.
	 * 
	 * @category Test - API
	 */
	test('getArticleComment result test', async () => {
		let data: IAPIData = {
			subreddit: "reddit.com",
			article_id: "lghsk",
			comment_id: "c2sr3r1",
		};
		let result: [IGenericResult<IListing<IArticle>>, IGenericResult<IListing<IComment>>] = await api.getArticleComment(data);
		assert.equal("Listing", result[1].kind);
		assert.notEqual(undefined, result[1].data);
		assert.equal("t1", result[1].data.children[0].kind);
	});

	/**
	 * Testing the rejection of `getUserPage`.
	 * 
	 * @category Test - API
	 */
	test('getUserPage rejected test', async () => {
		let data: IAPIData = {};
		let rejected: Promise<IGenericResult<IListing<IArticle | IComment>>> = api.getUserPage(data);
		assert.rejects(rejected);
		rejected.catch(err => {
			assert.equal("Error: required params are missing!\nusername\n", err);
		});
	});

	/**
	 * Testing the resolved result of `getUserPage`.
	 * 
	 * @category Test - API
	 */
	test('getUserPage result test', async () => {
		let data: IAPIData = {
			username: "gallowboob"
		};
		let result: IGenericResult<IListing<IArticle | IComment>> = await api.getUserPage(data);
		assert.equal("Listing", result.kind);
		assert.notEqual(undefined, result.data);
		assert.equal(25, result.data.children.length);
	});

	/**
	 * Testing the limit option of `getUserPage`.
	 * 
	 * @category Test - API
	 */
	test('getUserPage limit test', async () => {
		let data: IAPIData = {
			username: "gallowboob",
			limit: 10
		};
		let result: IGenericResult<IListing<IArticle | IComment>> = await api.getUserPage(data);
		assert.equal("Listing", result.kind);
		assert.notEqual(undefined, result.data);
		assert.equal(10, result.data.children.length);
	});

	/**
	 * Testing the rejection of `getUserAbout`.
	 * 
	 * @category Test - API
	 */
	test('getUserAbout rejected test', async () => {
		let data: IAPIData = {};
		let rejected: Promise<IGenericResult<IUserAbout>> = api.getUserAbout(data);
		assert.rejects(rejected);
		rejected.catch(err => {
			assert.equal("Error: required params are missing!\nusername\n", err);
		});
	});

	/**
	 * Testing the resolved result of `getUserAbout`.
	 * 
	 * @category Test - API
	 */
	test('getUserAbout result test', async () => {
		let data: IAPIData = {
			username: "gallowboob"
		};
		let result: IGenericResult<IUserAbout> = await api.getUserAbout(data);
		assert.equal("t2", result.kind);
		assert.notEqual(undefined, result.data);
		assert.equal("GallowBoob", result.data.name);
	});

	/**
	 * Testing the rejection of `getUserSubmitted`.
	 * 
	 * @category Test - API
	 */
	test('getUserSubmitted rejected test', async () => {
		let data: IAPIData = {};
		let rejected: Promise<IGenericResult<IListing<IArticle>>> = api.getUserSubmitted(data);
		assert.rejects(rejected);
		rejected.catch(error => {
			assert.equal("Error: required params are missing!\nusername\n", error);
		});
	});

	/**
	 * Testing the resolved result of `getUserSubmitted`.
	 * 
	 * @category Test - API
	 */
	test('getUserSubmitted result test', async () => {
		let data: IAPIData = {
			username: "gallowboob"
		};
		let result: IGenericResult<IListing<IArticle>> = await api.getUserSubmitted(data);
		assert.equal("Listing", result.kind);
		assert.notEqual(undefined, result.data);
		assert.equal(25, result.data.children.length);
		assert.equal("t3", result.data.children[0].kind);
	});

	/**
	 * Testing the limit option of `getUserSubmitted`.
	 * 
	 * @category Test - API
	 */
	test('getUserSubmitted limit test', async () => {
		let data: IAPIData = {
			username: "gallowboob",
			limit: 10
		};
		let result: IGenericResult<IListing<IArticle>> = await api.getUserSubmitted(data);
		assert.equal("Listing", result.kind);
		assert.notEqual(undefined, result.data);
		assert.equal(10, result.data.children.length);
	});

	/**
	 * Testing the rejection of `getUserComment`.
	 * 
	 * @category Test - API
	 */
	test('getUserComment rejected test', async () => {
		let data: IAPIData = {};
		let rejected: Promise<IGenericResult<IListing<IComment>>> = api.getUserComment(data);
		assert.rejects(rejected);
		rejected.catch(error => {
			assert.equal("Error: required params are missing!\nusername\n", error);
		});
	});

	/**
	 * Testing the resolved result of `getUserComment`.
	 * 
	 * @category Test - API
	 */
	test('getUserComment result test', async () => {
		let data: IAPIData = {
			username: "gallowboob"
		};
		let result: IGenericResult<IListing<IComment>> = await api.getUserComment(data);
		assert.equal("Listing", result.kind);
		assert.notEqual(undefined, result.data);
		assert.equal(25, result.data.children.length);
		assert.equal("t1", result.data.children[0].kind);
	});

	/**
	 * Testing the limit option of `getUserComment`.
	 * 
	 * @category Test - API
	 */
	test('getUserComment limit test', async () => {
		let data: IAPIData = {
			username: "gallowboob",
			limit: 10
		};
		let result: IGenericResult<IListing<IComment>> = await api.getUserComment(data);
		assert.equal("Listing", result.kind);
		assert.notEqual(undefined, result.data);
		assert.equal(10, result.data.children.length);
	});

	/**
	 * Testing the rejection of `getUserMulti`.
	 * 
	 * @category Test - API
	 */
	test('getUserMulti rejected test', async () => {
		let data: IAPIData = {};
		let rejected: Promise<Array<IGenericResult<IMulti>>> = api.getUserMulti(data);
		assert.rejects(rejected);
		rejected.catch(error => {
			assert.equal("Error: required params are missing!\nusername\n", error);
		});
	});

	/**
	 * Testing the resolved result of `getUserMulti`.
	 * 
	 * @category Test - API
	 */
	test('getUserMulti result test', async () => {
		let data: IAPIData = {
			username: "gallowboob"
		};
		let result: Array<IGenericResult<IMulti>> = await api.getUserMulti(data);
		assert.equal("LabeledMulti", result[0].kind);
		assert.equal("GallowBoob", result[0].data.owner);
	});

	/**
	 * Testing the rejection of `getMultiArticle`.
	 * 
	 * @category Test - API
	 */
	test('getMultiArticle rejected test', async () => {
		let data: IAPIData = {};
		let rejected: Promise<IGenericResult<IListing<IArticle>>> = api.getMultiArticle(data);
		assert.rejects(rejected);
		rejected.catch(error => {
			assert.equal("Error: required params are missing!\nusername\nmulti\n", error);
		});

		data = {
			username: "gallowboob"
		};
		rejected = api.getMultiArticle(data);
		assert.rejects(rejected);
		rejected.catch(error => {
			assert.equal("Error: required params are missing!\nmulti\n", error);
		});
	});

	/**
	 * Testing the resolved result of `getMultiArticle`.
	 * 
	 * @category Test - API
	 */
	test('getMultiArticle result test', async () => {
		let data: IAPIData = {
			username: "gallowboob",
			multi: "space"
		};
		let result: IGenericResult<IListing<IArticle>> = await api.getMultiArticle(data);
		assert.equal("Listing", result.kind);
		assert.notEqual(undefined, result.data);
		assert.equal(25, result.data.children.length);
		assert.equal("t3", result.data.children[0].kind);
	});

	/**
	 * Testing the limit option of `getMultiArticle`.
	 * 
	 * @category Test - API
	 */
	test('getMultiArticle limit test', async () => {
		let data: IAPIData = {
			username: "gallowboob",
			multi: "space",
			limit: 10
		};
		let result: IGenericResult<IListing<IArticle>> = await api.getMultiArticle(data);
		assert.equal("Listing", result.kind);
		assert.notEqual(undefined, result.data);
		assert.equal(10, result.data.children.length);
		assert.equal("t3", result.data.children[0].kind);
	});

	/**
	 * Testing the resolved result of `getMine`.
	 * 
	 * @category Test - API
	 */
	test('getMine result test', async () => {
		let data: IAPIData = {};
		let result: IGenericResult<IListing<IArticle>> = await api.getMine(data);
		assert.equal("Listing", result.kind);
		assert.notEqual(undefined, result.data);
		assert.equal(25, result.data.children.length);
		assert.equal("t3", result.data.children[0].kind);
	});

	/**
	 * Testing the limit option of `getMine`.
	 * 
	 * @category Test - API
	 */
	test('getMine limit test', async () => {
		let data: IAPIData = {
			limit: 10
		};
		let result: IGenericResult<IListing<IArticle>> = await api.getMine(data);
		assert.equal("Listing", result.kind);
		assert.notEqual(undefined, result.data);
		assert.equal(10, result.data.children.length);
		assert.equal("t3", result.data.children[0].kind);
	});

	/**
	 * Testing the rejection of `getSearchSubreddit`.
	 * 
	 * @category Test - API
	 */
	test('getSearchSubreddit rejected test', async () => {
		let data: IAPIData = {};
		let rejected: Promise<ISubredditSearchResult> = api.getSearchSubreddit(data);
		assert.rejects(rejected);
		rejected.catch(error => {
			assert.equal("Error: required params are missing!\nsearch\n", error);
		});
	});

	/**
	 * Testing the resolved result of `getSearchSubreddit`.
	 * 
	 * @category Test - API
	 */
	test('getSearchSubreddit result test', async () => {
		let data: IAPIData = {
			search: "as"
		};
		let result: ISubredditSearchResult = await api.getSearchSubreddit(data);
		assert.equal(10, result.names.length);
		let pattern = new RegExp("as", "gi");
		assert.equal(true, pattern.test(result.names[0]));
	});

	/**
	 * Testing the rejection of `getSearchArticle`.
	 * 
	 * @category Test - API
	 */
	test('getSearchArticle rejected test', async () => {
		let data: IAPIData = {};
		let rejected: Promise<IGenericResult<IListing<IArticle>>> = api.getSearchArticle(data);
		assert.rejects(rejected);
		rejected.catch(error => {
			assert.equal("Error: required params are missing!\nsearch\n", error);
		});
	});

	/**
	 * Testing the resolved result of `getSearchArticle`.
	 * 
	 * @category Test - API
	 */
	test('getSearchArticle result test', async () => {
		let data: IAPIData = {
			search: "as"
		};
		let result: IGenericResult<IListing<IArticle>> = await api.getSearchArticle(data);
		assert.equal("Listing", result.kind);
		assert.notEqual(undefined, result.data);
		assert.equal(25, result.data.children.length);
		assert.equal("t3", result.data.children[0].kind);
	});

	/**
	 * Testing the limit option of `getSearchArticle`.
	 * 
	 * @category Test - API
	 */
	test('getSearchArticle limit test', async () => {
		let data: IAPIData = {
			search: "as",
			limit: 10
		};
		let result: IGenericResult<IListing<IArticle>> = await api.getSearchArticle(data);
		assert.equal("Listing", result.kind);
		assert.notEqual(undefined, result.data);
		assert.equal(10, result.data.children.length);
		assert.equal("t3", result.data.children[0].kind);
	});
});
