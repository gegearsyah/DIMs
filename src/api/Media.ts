import FetchService from '@services/FetchService';

export const postUploadMedia = async (data: FormData) => {
  const fetch = FetchService({
    headers: {'Content-Type': 'multipart/form-data'},
  });

  const result = await fetch('media/upload/', {
    method: 'POST',
    body: data,
  });

  return result;
};
