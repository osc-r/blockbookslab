// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

const ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const response = await axios.get(
    // "http://localhost:4000/api/v1/auth/nonce",
    `${ENDPOINT}/api/v1/transactions`,
    {
      headers: {
        // @ts-ignore
        Authorization: req.headers.authorization,
      },
      params: {
        current: req.query.current,
        limit: req.query.limit,
      },
    }
  );
  res.send(response.data.data);
}
