/** Page size the API uses when only `page` is sent. */
const DEFAULT_PAGE_SIZE = 50;

/** @internal */
export type FetchPage<T> = (query: Record<string, unknown>) => Promise<Page<T>>;

/**
 * One page of a list.
 *
 * `page.items` holds this page. `for await` over the page goes through every item of every page and requests the
 * next pages as needed.
 */
export class Page<T> implements AsyncIterable<T> {
  /** The items of this page. */
  readonly items: T[];
  /** How many items match the request across all pages, when the API reports it. */
  readonly totalCount: number | null;

  readonly #query: Record<string, unknown>;
  readonly #fetch: FetchPage<T>;

  /** @internal */
  constructor(items: T[], totalCount: number | null, query: Record<string, unknown>, fetch: FetchPage<T>) {
    this.items = items;
    this.totalCount = totalCount;
    this.#query = query;
    this.#fetch = fetch;
  }

  #position(): [page: number, limit: number | null] {
    const page = this.#query['page'];
    const limit = this.#query['limit'];
    const pageIndex = typeof page === 'number' ? page : 0;
    if (typeof limit === 'number') return [pageIndex, limit];
    if (page !== undefined) return [pageIndex, DEFAULT_PAGE_SIZE];
    return [pageIndex, this.items.length || null];
  }

  hasNextPage(): boolean {
    if (!this.items.length) return false;
    const [page, limit] = this.#position();
    if (limit === null) return false;
    if (this.totalCount === null) return this.items.length >= limit;
    return page * limit + this.items.length < this.totalCount;
  }

  async getNextPage(): Promise<Page<T>> {
    if (!this.hasNextPage()) throw new Error('No next page; check hasNextPage() first');
    const [page, limit] = this.#position();
    return this.#fetch({ ...this.#query, page: page + 1, limit });
  }

  /** Every page, starting with this one. */
  async *iterPages(): AsyncGenerator<Page<T>> {
    let page: Page<T> = this;
    while (true) {
      yield page;
      if (!page.hasNextPage()) return;
      page = await page.getNextPage();
    }
  }

  async *[Symbol.asyncIterator](): AsyncGenerator<T> {
    for await (const page of this.iterPages()) yield* page.items;
  }
}

/**
 * The result of a list method: await it for the first page, or iterate it with `for await` to go through every
 * item of every page.
 *
 * ```ts
 * const page = await client.sms.list({ limit: 100 });
 * for await (const sms of client.sms.list({ limit: 100 })) console.log(sms.message_decoded);
 * ```
 */
export class PagePromise<T> implements PromiseLike<Page<T>>, AsyncIterable<T> {
  #promise: Promise<Page<T>> | undefined;
  readonly #load: () => Promise<Page<T>>;

  /** @internal */
  constructor(load: () => Promise<Page<T>>) {
    this.#load = load;
  }

  #page(): Promise<Page<T>> {
    this.#promise ??= this.#load();
    return this.#promise;
  }

  then<R1 = Page<T>, R2 = never>(
    onfulfilled?: ((value: Page<T>) => R1 | PromiseLike<R1>) | null,
    onrejected?: ((reason: unknown) => R2 | PromiseLike<R2>) | null,
  ): Promise<R1 | R2> {
    return this.#page().then(onfulfilled, onrejected);
  }

  catch<R = never>(onrejected?: ((reason: unknown) => R | PromiseLike<R>) | null): Promise<Page<T> | R> {
    return this.#page().catch(onrejected);
  }

  finally(onfinally?: (() => void) | null): Promise<Page<T>> {
    return this.#page().finally(onfinally);
  }

  async *[Symbol.asyncIterator](): AsyncGenerator<T> {
    const page = await this.#page();
    yield* page;
  }
}
