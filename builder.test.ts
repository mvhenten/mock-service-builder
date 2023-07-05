import test from "ava";
import { RestHandler } from "msw";
import { MockServiceBuilder } from "./builder.js";

test("Creates POST endpoint", (t) => {
  const endpoitnUrl = "https://api.example.com/endpoint/";
  const builder = new MockServiceBuilder(endpoitnUrl);

  type BodyType = {
    ok: boolean;
  };

  builder.post("foo", async (): Promise<BodyType> => {
    return {
      ok: true,
    };
  });

  const endpoints = builder.getEndpoints();

  t.is(endpoints.length, 1);

  const [endpoint] = endpoints;

  t.assert(endpoint instanceof RestHandler);
  t.is(endpoint.info.method, "POST");
  t.is(endpoint.info.path, endpoitnUrl + "foo");
});

test("Creates GET endpoint", (t) => {
  const endpoitnUrl = "https://api.example.com/endpoint/";
  const builder = new MockServiceBuilder(endpoitnUrl);

  type BodyType = {
    ok: boolean;
  };

  builder.get("foo", async (): Promise<BodyType> => {
    return {
      ok: true,
    };
  });

  const endpoints = builder.getEndpoints();

  t.is(endpoints.length, 1);

  const [endpoint] = endpoints;

  t.assert(endpoint instanceof RestHandler);
  t.is(endpoint.info.method, "GET");
  t.is(endpoint.info.path, endpoitnUrl + "foo");
});
