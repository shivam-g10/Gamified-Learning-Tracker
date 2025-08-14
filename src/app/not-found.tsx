export default function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center min-h-[50vh] space-y-4'>
      <h2 className='text-2xl font-bold'>Not Found</h2>
      <p className='text-muted-foreground'>
        Could not find the requested resource.
      </p>
    </div>
  );
}
