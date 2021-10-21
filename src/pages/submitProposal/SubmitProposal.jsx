import React from 'react'
import {Input, Textarea} from '../../shared/styles'
import { SubmitProposalContainer, Heading } from './SubmitProposal.styles'
import { useHistory } from "react-router-dom"
import { useForm } from "react-hook-form"
import { BASE_URL } from '../../shared/urls.js'

export function SubmitProposal() {

  const dateOptions =  {weekday:'long', year:'numeric', month:'short', day:'numeric', hour:'numeric', minute:'numeric', timeZoneName:'short'};
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const history = useHistory();

  const onSubmit = data => {

    console.log(data);

    data.options = [];

    for (let i = 0; data["option-"+i]; i++) {
      console.log("option-"+i)
      data.options.push(data["option-"+i]);
    }
    Wallet.onConnect().then( () => {

      if(!Wallet.selectedAccount){
        alert('Please connect your wallet to continue!');
        return;
      }

      let walletAddress = Wallet.selectedAccount.toLowerCase()

      let timestamp = Date.now()

      let message = "New proposal:\n" +
                    'Title: ' + data.proposal_title_input + "\n" +
                    'Description: ' + data.proposal_description_input + "\n" +
                    'Timestamp: ' + timestamp;

      let password = ''
      Wallet.web3.eth.personal.sign(
        message,
        walletAddress,
        password,
        function (err, signature) {
          console.log('submitProposal 3!!!')

          if (err) {
            alert('Signature Denied');
            return;
          }
          if (signature) {

            console.log('signature! ' + signature)

            axios.post(BASE_URL + '/submitproposal', {
              signature: signature,
              walletAddress: walletAddress,
              title: data.proposal_title_input,
              description: data.proposal_description_input,
              endTimestamp: expDate.getTime(),
              options: data.options,
              timestamp: timestamp,
            })
            .then(function (response) {
              history.push('/proposal/' + response.data.proposalId);
              alert('Proposal submitted successfully!')
            })
            .catch(console.error)

          }
        }
      );

    });



  }

  const calcExpDate = expDays => {

    let expTimestamp = new Date();

    console.log(expTimestamp.getUTCHours())
    if(expTimestamp.getUTCHours() > 10) {expDays += 1;}
    expTimestamp.setDate(expTimestamp.getDate() + expDays);
    expTimestamp.setUTCHours(3);
    expTimestamp.setUTCMinutes(0);
    expTimestamp.setUTCSeconds(0);
    expTimestamp.setUTCMilliseconds(0);

    return expTimestamp;

  }

  const expDayChange = element => {

    const expTimestamp = calcExpDate(parseInt(element.target.value));

    setExpDate(expTimestamp);

  }

  const [expDate, setExpDate] = React.useState(calcExpDate(3))


  return (
    <div className="container-xl">
      <div>
    <SubmitProposalContainer className="app-card shadow-sm">
      <div style={{marginBottom: '18px'}}>
        <Heading>Submit Proposal</Heading>
      </div>
      <form id="proposal_form" className="" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group mb-3">
          <label htmlFor="proposal_title_input" className="form-label">Title</label>
          <Input
            type="text"
            {...register("proposal_title_input", { required: true })}
            placeholder="Title"
            className="form-control"
          />
        {errors.proposal_title_input?.type === 'required' && "Title is required"}
        </div>
        <div className="form-group mb-3">
          <label htmlFor="proposal_description_input" className="form-label">Description</label>
          <Textarea
            style={{ minHeight: "150px" }}
            type="text"
            {...register("proposal_description_input", { required: true })}
            placeholder="Description"
            className="form-control"
          />
          {errors.proposal_description_input?.type === 'required' && "Description is required"}
        </div>

        <div className="form-group mb-3">
          <label className="form-label">Options:</label>
          <div className="form-group mb-3">
            {[0,1,2,3].map((option) => (
              <div className="form-group mb-3" role="group" key={'option-' + option.toString()}>
                <input
                    {...register("option-"+option.toString(), { required: (option < 2) })}
                    type="text"
                    placeholder={"Option " +  (option+1).toString() + (option > 1 ? ' (Optional)' : '')}
                    id={'option-' + option.toString()}
                    className="form-control"
                />
              {errors["option-"+option.toString()]?.type === 'required' && "This field is required"}
              </div>
            ))}
          </div>
        </div>

        <div className="form-group mb-3">
          <label className="form-label">Days to End of Proposal</label>
          <div className="form-group mb-3">
            <div className="btn-group" role="group" aria-label="Days to End of Proposal">
              {[3,4,5,6,7].map((day) => [
                <input
                    {...register("expdays", { required: true })}
                    type="radio"
                    value={day}
                    key={'btnradio-' + day}
                    id={'btnradio-' + day}
                    autoComplete="off"
                    className="btn-check"
                    onChange={expDayChange}
                    defaultChecked={(day == 3)}

                />,
              <label key={'btnradiolabel-' + day} className="btn btn-outline-secondary" htmlFor={'btnradio-' + day}>{day}</label>
              ])}
            </div>
          </div>
          <label className="form-label">{expDate.toLocaleDateString(undefined, dateOptions)}</label>
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
        <span style={{marginLeft: '20px'}}>
          You need at least 100 weight points to create a proposal!
        </span>
      </form>
    </SubmitProposalContainer>
    </div>
  </div>
  )
}
