import { createSupabaseBrowserClient } from '@/integrations/supabase/supabase-client';

/**
 * Optional Storage helpers. Define bucket names when your product needs uploads.
 * Add matching RLS under `integrations/supabase/policies/` and extend `BucketNames`.
 */
export const BucketNames = {} as const;

export type BucketName = (typeof BucketNames)[keyof typeof BucketNames];

const supabase = createSupabaseBrowserClient();

export function removeFromBucket(bucket: BucketName, paths: string[]) {
  return supabase.storage.from(bucket).remove(paths);
}

/**
 * Upload with the signed-in user's JWT (RLS applies).
 * Persist `uploadResult.path` (bucket-relative), not a public URL.
 */
export async function uploadFileToBucket(
  bucket: BucketName,
  newFilePath: string,
  file: File,
  oldFilePath?: string | null,
) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) return { error: userError };
  if (!user)
    return {
      error: new Error(
        'No Supabase session (JWT). Refresh and sign in again; ensure cookies are not blocked.',
      ),
    };

  const normalizedPath = newFilePath.replace(/^\/+/, '');

  if (oldFilePath) {
    const trimmedOld = oldFilePath.replace(/^\/+/, '');
    const { data: deleteData, error: deleteError } = await removeFromBucket(
      bucket,
      [trimmedOld],
    );
    if (deleteError || !deleteData)
      return { error: deleteError ?? new Error('Delete failed') };
  }

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(normalizedPath, file, {
      upsert: false,
      contentType: file.type || undefined,
    });

  if (uploadError || !uploadData)
    return { error: uploadError ?? new Error('Upload failed') };

  return { uploadResult: { path: uploadData.path } };
}

export const ClientStorageService = {
  remove: removeFromBucket,
  uploadFile: uploadFileToBucket,
} as const;
