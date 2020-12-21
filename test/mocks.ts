type ReqMock = {
    headers?: { "Content-Type"?: string };
    params?: Record<string, string>;
    body?: unknown;
    is: jest.Mock;
};

type ResMock = {
    status: jest.Mock;
    json: jest.Mock;
};

export type { ReqMock, ResMock };
