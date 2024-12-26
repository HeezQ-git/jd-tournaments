export default function supabaseLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  // eslint-disable-next-line max-len
  return `https://${process.env.NEXT_PUBLIC_SUPABASE_PID}.supabase.co/storage/v1/object/public/${src}?width=${width}&quality=${quality || 75}`;
}
