
export interface RpcResponse {
  error?: {
    code: number,
    data: {
      error: string,
      message: string
    },
    message: string,
  },
  id: string,
  jsonrpc: string,
}
