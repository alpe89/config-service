// Override the value to use in-memory only
process.env.DB_TYPE = "Memory";
process.env.NODE_ENV = "test";
import request from "supertest";
import { makeServer } from "../../src/server/app";
import { StoreFactory } from "../../src/class/StoreFactory";

let app: unknown;

describe("GET /", () => {
    beforeEach(() => {
        const store = StoreFactory("Memory");
        app = makeServer(store);
    });

    test("Searching in a blank state should result in an empty object", async done => {
        request(app)
            .get("/")
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.status).toBe(200);
                expect(Object.keys(res.body.data).length).toBe(0);
                done();
            });
    });

    test("Searching after one addition should give the correct value", async done => {
        const payload = {
            id: "pizza",
            name: "test",
            value: "Margherita",
        };

        request(app)
            .post("/pizza")
            .set("Content-Type", "application/json")
            .send(JSON.stringify(payload))
            .end(err => {
                if (err) return done(err);
            });

        request(app)
            .get("/")
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.status).toBe(200);
                expect(Object.keys(res.body.data).length).toBe(1);
                expect(res.body.data.pizza).toBe("Margherita");
                done();
            });
    });

    test("Searching after one addition should give the correct value", async done => {
        const payload = {
            id: "pizza",
            name: "test",
            value: "Margherita",
        };

        const payload2 = {
            id: "pizza2",
            name: "test",
            value: "Capricciosa",
        };

        request(app)
            .post("/pizza")
            .set("Content-Type", "application/json")
            .send(JSON.stringify(payload))
            .end(err => {
                if (err) return done(err);
            });

        request(app)
            .post("/pizza2")
            .set("Content-Type", "application/json")
            .send(JSON.stringify(payload2))
            .end(err => {
                if (err) return done(err);
            });

        request(app)
            .get("/")
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.status).toBe(200);
                expect(Object.keys(res.body.data).length).toBe(2);
                expect(res.body.data.pizza).toBe("Margherita");
                expect(res.body.data.pizza2).toBe("Capricciosa");
                done();
            });
    });
});

describe("GET /:configId", () => {
    beforeEach(() => {
        const store = StoreFactory("Memory");
        app = makeServer(store);
    });

    test("Searching for Config ID pizza where is not set should return a 404 code", async done => {
        request(app)
            .get("/pizza")
            .end((err, res) => {
                if (err) return err;
                expect(res.body.status).toBe(404);
                done();
            });
    });

    test("Searching for Config ID pizza when it is set should return the correct value", async done => {
        const payload = {
            id: "pizza",
            name: "test",
            value: "Margherita",
        };

        const updatedStore = StoreFactory("Memory");
        updatedStore.set("pizza", payload);
        app = makeServer(updatedStore);

        request(app)
            .get("/pizza")
            .end((err, res) => {
                if (err) return err;
                expect(res.body.status).toBe(200);
                expect(res.body.data).toBe("Margherita");
                done();
            });
    });
});

describe("POST /:configId", () => {
    beforeEach(() => {
        const store = StoreFactory("Memory");
        app = makeServer(store);
    });

    test("Should return a status of 200 after inserting a configuration", async done => {
        const payload = {
            id: "pizza",
            name: "test",
            value: "Margherita",
        };

        request(app)
            .post("/pizza")
            .set("Content-Type", "application/json")
            .send(JSON.stringify(payload))
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.status).toBe(200);
                expect(res.body.message).toBe("ok");
                done();
            });
    });

    test("Should return a status of 400 if the provided key is already in memory", async done => {
        const payload = {
            id: "pizza",
            name: "test",
            value: "Margherita",
        };

        const updatedStore = StoreFactory("Memory");
        updatedStore.set("pizza", payload);
        app = makeServer(updatedStore);

        request(app)
            .post("/pizza")
            .set("Content-Type", "application/json")
            .send(JSON.stringify(payload))
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.status).toBe(400);
                expect(res.body.message).toBe(
                    "Could not insert the configuration provided"
                );
                done();
            });
    });
});
