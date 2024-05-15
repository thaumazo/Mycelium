import * as apiUtils from '$lib/apiUtils.js';

export const GET = async (event) => {
  return apiUtils.GET(event);
};

export const POST = async (event) => {
  return apiUtils.POST(event);
};

export const PATCH = async (event) => {
  return apiUtils.POST(event);
};