export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-800 p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
        {children}
        {footer && <div className="mt-4 flex justify-end gap-4">{footer}</div>}
      </div>
    </div>
  );
};
