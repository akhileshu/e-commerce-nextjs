import React from 'react'
import Client from './client'
import { unstable_cache } from 'next/cache';

const getRandom = unstable_cache(() => Math.random(), ["product"], {
  tags: ["number"],
});
async function page() {
    const random = await getRandom();
  return (
    <div>
      <p>number : {random}</p>
      <Client />
    </div>
  );
}

export default page