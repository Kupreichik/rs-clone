export const Account = () => {
  return (
    <section className="account">
      <div className="container">
        <form action="" method="post">
          <p>Your Name</p>
          <input type="text" required placeholder="Name" />

          <p>Choose a username</p>
          <input type="text" required placeholder="Username" />

          <p>E-mail</p>
          <input type="text" required placeholder="E-mail" />

          <p>Choose Password</p>
          <input type="password" required placeholder="Password" />

          <input type="submit"></input>
        </form>
      </div>
    </section>
  );
};
