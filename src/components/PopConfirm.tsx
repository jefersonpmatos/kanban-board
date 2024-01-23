import { useState, ReactNode, FC } from "react";

interface PopconfirmProps {
  onConfirm: () => void;
  children: ReactNode;
}

export const Popconfirm: FC<PopconfirmProps> = ({ onConfirm, children }) => {
  const [visible, setVisible] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    console.log("teste");
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <div
      className="relative inline-block"
      onClick={(e) => {
        e.stopPropagation();
        setVisible(true);
      }}
      onBlur={(e) => {
        e.stopPropagation();
        handleCancel();
      }}
    >
      {children}

      {visible && (
        <div
          className="absolute -left-48 z-20 w-fit px-4 py-2 bg-columnBgColor flex flex-col items-start border border-rose-500"
          role="dialog"
          aria-modal="true"
        >
          <p>Excluir?</p>
          <div className="flex gap-2 items-center mt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCancel();
              }}
              className="text-sky-500 text-sm border-sky-500 border px-2 py-1"
            >
              Cancelar
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleConfirm();
              }}
              className="text-rose-500 text-sm border border-rose-500  px-2 py-1"
            >
              Confirmar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
