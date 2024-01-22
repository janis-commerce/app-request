import axios from "axios";
import { getUserInfo, getAccessToken } from "@janiscommerce/oauth-native";
import Request from "../lib/request.js";

jest.mock("axios");

describe("Request", () => {
  const JANIS_ENV = "janislocal";
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe("get", () => {
    describe("params errors validations", () => {
      it.each(["", false, undefined, null, {}, []])(
        "should throw an error if namespace is not valid",
        async (invalidNamespace) => {
          const api = new Request({ JANIS_ENV: "janislocal" });
          await expect(
            api.get({ namespace: invalidNamespace })
          ).rejects.toThrow("namespace is not valid");
        }
      );

      it.each(["", false, undefined, null, {}, []])(
        "should throw an error if service is not valid",
        async (invalidService) => {
          const api = new Request({ JANIS_ENV: "janislocal" });
          await expect(
            api.get({ namespace: "session", service: invalidService })
          ).rejects.toThrow("service is not valid");
        }
      );

      it.each(["", false, undefined, null, {}, []])(
        "should throw an error if id is not valid",
        async (invalidId) => {
          const api = new Request({ JANIS_ENV: "janislocal" });
          await expect(
            api.get({ namespace: "session", service: "picking", id: invalidId })
          ).rejects.toThrow("id is not valid");
        }
      );
    });

    describe("getByEndpoint", () => {
      it("does request and returns data when endpoint param is passed", async () => {
        const api = new Request({ JANIS_ENV });

        const apiResponse = {
          data: {
            test: "123",
          },
        };

        axios.get.mockResolvedValue(apiResponse);

        const data = await api.get({
          endpoint: "https://picking.janislocal.in/api/session/asd123",
        });

        expect(data).toEqual(apiResponse.data);
      });

      it("returns an error if request of an endpoint passed fails", async () => {
        const api = new Request({ JANIS_ENV });

        axios.get.mockRejectedValue(new Error("error server"));

        await expect(
          api.get({
            endpoint: "https://server.test.com/get/asd123",
          })
        ).rejects.toThrow("error server");
      });
    });

    describe("get by service, namespace and id", () => {
      it("should return data if namespace and service are valid", async () => {
        getUserInfo.mockResolvedValue({ tcode: "exampleClient" });
        getAccessToken.mockResolvedValue("exampleAccessToken");
        const api = new Request({ JANIS_ENV });

        const apiResponse = {
          data: {
            test: "123",
          },
        };

        axios.get.mockResolvedValue(apiResponse);

        const data = await api.get({
          service: "picking",
          namespace: "session",
          id: "123",
        });

        expect(data).toEqual(apiResponse.data);
      });
    });
  });

  describe("list", () => {
    describe("params errors validations", () => {
      it.each(["", false, undefined, null, {}, []])(
        "should throw an error if namespace is not valid",
        async (invalidNamespace) => {
          const api = new Request({ JANIS_ENV: "janislocal" });
          await expect(
            api.list({ namespace: invalidNamespace })
          ).rejects.toThrow("namespace is not valid");
        }
      );

      it.each(["", false, undefined, null, {}, []])(
        "should throw an error if service is not valid",
        async (invalidService) => {
          const api = new Request({ JANIS_ENV: "janislocal" });
          await expect(
            api.list({ namespace: "session", service: invalidService })
          ).rejects.toThrow("service is not valid");
        }
      );
    });

    describe("list by service and namespace", () => {
      it("should return data if namespace and service are valid", async () => {
        getUserInfo.mockResolvedValue({ tcode: "exampleClient" });
        getAccessToken.mockResolvedValue("exampleAccessToken");
        const api = new Request({ JANIS_ENV });

        const apiResponse = {
          data: ["123", "456", "789"],
          headers: {
            "x-janis-total": 20,
          },
        };

        axios.get.mockResolvedValue(apiResponse);

        const data = await api.list({
          service: "picking",
          namespace: "session",
        });

        expect(data).toEqual({
          result: apiResponse.data,
          isLastPage: true,
          total: 20,
        });
      });
    });
  });
});
