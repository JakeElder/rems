type Props = {
  children?: React.ReactNode;
  partial?: boolean;
};

const RefineCaveats = ({ children, partial = false }: Props) => {
  return (
    <>
      <p>Some points to take in to consideration;</p>
      <ul>
        <li>
          There may be additional criteria within the users input. Any extra
          information not pertinent to this task can be safely disregarded.
        </li>
        {partial ? (
          <li>
            You should *OMIT* values that have no change. Leave values that have
            not changes as undefined.
          </li>
        ) : null}
        {children}
      </ul>
    </>
  );
};

export default RefineCaveats;
