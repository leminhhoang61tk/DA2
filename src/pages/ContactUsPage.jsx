const ContactUsPage = () => {
  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-12">
          <h1 className="text-center mb-4">Contact Us</h1>
        </div>
        <div className="col-12 col-md-8 offset-md-2">
          <p className="text-center">
            Have questions or need assistance? We’re here to help. Whether
            you’re an admin needing support with managing operations or a
            transporter with queries about vehicle management, client bookings,
            or expenses, feel free to reach out. Our dedicated support team is
            always ready to assist you.
          </p>

          <form className="mt-4">
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Enter your name"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="message" className="form-label">
                Message
              </label>
              <textarea
                className="form-control"
                id="message"
                rows="4"
                placeholder="Enter your message"
              ></textarea>
            </div>
            <div className="text-center">
              <button type="submit" className="btn bg-color custom-bg-text">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
