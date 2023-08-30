type Props = {
  children?: React.ReactNode;
  partial?: boolean;
};

const RefineCaveats = ({ children, partial = false }: Props) => {
  return (
    <>
      <p>Some important points to take in to consideration;</p>
      <ul>
        <li>
          There may be additional criteria within the users input. Any extra
          information not pertinent to this task should be disregarded.
        </li>
        <li>
          You should be minimal in your output. Leave values as undefined unless
          you are sure the user has explicity requested search criteria be added
          or amended.
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
