import { describe, expect, it, vi } from "vitest";
import { askAgent } from "./api";

describe("askAgent", () => {
  it("envia a pergunta codificada na URL", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}"));
    vi.stubGlobal("fetch", fetchMock);

    await askAgent("canal com mais vendas?");

    expect(fetchMock).toHaveBeenCalledWith("/api/agent?q=canal%20com%20mais%20vendas%3F");
  });
});
