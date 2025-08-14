import {
  ReactNode,
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  SelectHTMLAttributes,
  HTMLAttributes,
} from 'react';
import clsx from 'clsx';

export function Card(props: HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  return <div className={clsx('card p-4', className)} {...rest} />;
}

export function Button({
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={clsx('btn', className)} {...rest} />;
}

export function PrimaryButton({
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={clsx('btn btn-primary', className)} {...rest} />;
}

export function Input({
  className,
  ...rest
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={clsx('w-full', className)} {...rest} />;
}

export function Select({
  className,
  children,
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement> & { children?: ReactNode }) {
  return (
    <select className={clsx('w-full', className)} {...rest}>
      {children}
    </select>
  );
}

export function Label({
  className,
  ...rest
}: HTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={clsx('block text-sm text-neutral-300 mb-1', className)}
      {...rest}
    />
  );
}

export function Section({
  title,
  children,
  actions,
}: {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <Card className='mb-4'>
      <div className='flex items-center justify-between mb-3'>
        <h2 className='text-base font-semibold'>{title}</h2>
        {actions}
      </div>
      {children}
    </Card>
  );
}
