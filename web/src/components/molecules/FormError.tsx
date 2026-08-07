interface FormErrorProps {
  message: string;
}

export function FormError({ message }: FormErrorProps) {
  return <p className="text-center text-[15px] font-bold text-error">{message}</p>;
}
