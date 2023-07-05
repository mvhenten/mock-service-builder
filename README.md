# mock-service-builder

This is a small wrapper around [msw](https://mswjs.io/). The purpose of this utility is to build a temporary mocking layer that intercepts requests and returns data in the right format.
This is an implementation of [Design By Contract](https://en.wikipedia.org/wiki/Design_by_contract).

## Usage


```typescript
import { CreatePetResponse } from "@mycorp/pet-store-client";
import { MockServiceBuilder } from "mock-builder";

export const worker = () => {
    const builder = new MockServiceBuilder("https://pet.api.example.com/v1");

    /*
    By setting the return value to Promise<CreatePetResponse>,
    typescript will enforce the correct return values.
    */
    builder.post("pets", async (req): Promise<CreatePetResponse> => {
        const { name, species } = await req.json();

        const id = crypto.randomUUID();
        const created = Date.UTC()

        // dunno, store it somehow in indexedb?
        await idb.set(id, {name, species, created})

        return { id, created , name, species, birthdate };
    });

    return builder.start();
};

// call this somewhere top level in your app
worker();
```