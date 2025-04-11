export function Label({ children, required, ...props }) {
  return (
    <label className="block text-sm text-gray-700 font-normal data-[error=true]:text-destructive data-[error=true]:font-medium" {...props}>
      {children}
      {
        required && <span className="text-destructive text-sm before:content-['*'] ml-1" />
      }
    </label>
  )
}