// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

const ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const response = await axios.get(`${ENDPOINT}/csv`, {
    headers: {
      Authorization: req.headers.authorization,
      "Content-Type": "text/csv",
    },
  });

  console.log({ response });

  res.send(response.data);
}
