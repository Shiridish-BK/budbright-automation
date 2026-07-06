import { test, expect } from '@playwright/test';

const SUPASEBASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;

test('verify user endpoint', async ({ request }) => {
  const response = await request.get(`${SUPASEBASE_URL}/rest/v1/profiles`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });

  expect(response.status()).toBe(200);
  const body = await response.text();
  expect(body).toEqual("[]");

});

const USER_ACCESS_TOKEN = process.env.SUPABASE_USER_ACCESS_TOKEN!;
const TEST_USER_ID = process.env.SUPABASE_TEST_USER_ID!;

test('authenticated user can read own profile (RLS allows owner)', async ({ request }) => {
  const response = await request.get(
    `${SUPASEBASE_URL}/rest/v1/profiles?id=eq.${TEST_USER_ID}`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${USER_ACCESS_TOKEN}`,
      },
    }
  );

  expect(response.status()).toBe(200);

  const body = await response.json();
  console.log(body);
  expect(body.length).toBe(1);
  expect(body[0].id).toBe(TEST_USER_ID);
});