import {
  ResponseComposition,
  rest,
  RestContext,
  RestHandler,
  RestRequest,
  setupWorker,
  StartOptions,
} from "msw";

type Handler<Type> = (
  req: RestRequest,
  res: ResponseComposition,
  ctx: RestContext
) => Promise<Type>;

const epoch = (date: Date) => Math.floor(date.getTime() / 1000);

const dateTransformer = (key: string, value: unknown) => {
  if (
    ["createdAt", "updatedAt", "effectiveDate"].includes(key) &&
    typeof value == "string"
  ) {
    const dt = new Date(value);
    return epoch(dt);
  }
  return value;
};

export class MockServiceBuilder {
  private endpoints: RestHandler[] = [];
  private endpoint: URL;

  constructor(private _endpoint: string) {
    this.endpoint = new URL(_endpoint);
  }

  getEndpoints() {
    return [...this.endpoints];
  }

  get(path: string, handler: Handler<unknown>) {
    const fullpath = this.createUrl(path);
    this.endpoints.push(rest.get(fullpath, this.wrapHandler(handler)));
    return this;
  }

  post(path: string, handler: Handler<unknown>) {
    const fullpath = this.createUrl(path);
    this.endpoints.push(rest.post(fullpath, this.wrapHandler(handler)));
    return this;
  }

  put(path: string, handler: Handler<unknown>) {
    const fullpath = this.createUrl(path);
    this.endpoints.push(rest.put(fullpath, this.wrapHandler(handler)));
    return this;
  }

  delete(path: string, handler: Handler<unknown>) {
    const fullpath = this.createUrl(path);
    this.endpoints.push(rest.delete(fullpath, this.wrapHandler(handler)));
    return this;
  }

  private wrapHandler(handler: Handler<unknown>) {
    return async (
      req: RestRequest,
      res: ResponseComposition,
      ctx: RestContext
    ) => {
      const response = await handler(req, res, ctx);
      if (typeof response !== "object")
        throw new Error("Unexpected response type: " + response);

      const json = JSON.stringify(response, dateTransformer);
      return res(ctx.json(JSON.parse(json)));
    };
  }

  private createUrl(path: string) {
    return new URL(path, this.endpoint).toString();
  }

  start(options?: StartOptions) {
    const worker = setupWorker(...this.endpoints);
    worker.start(options);
  }
}
