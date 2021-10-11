import React from 'react'
import {Input, Textarea} from '../../shared/styles'
import { SubmitProposalContainer, Heading } from './SubmitProposal.styles'
import { useHistory } from "react-router-dom"
import { useForm } from "react-hook-form"
import { BASE_URL } from '../../shared/urls.js'

export function SubmitProposal() {

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const history = useHistory();

  const onSubmit = data => {

    console.log(data);

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

      // TODO: add more signature verification on proposals, to make sure that wallet address actually submitted the proposal

      let password = ''
      web3.eth.personal.sign(
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

            let xhr = new XMLHttpRequest()
            xhr.responseType = 'json';
            xhr.open('POST', BASE_URL + '/submitproposal', true)
            xhr.setRequestHeader('Content-Type', 'application/json')

            xhr.onreadystatechange = function () {
              if (xhr.readyState == XMLHttpRequest.DONE) {

                console.log('response: ' + xhr.response)

                if (xhr.status == 200) {
                  let result = xhr.response;

                  if (result.error) {
                    if(result.error.msg){
                      alert(result.error.msg)
                    } else {
                      alert('Proposal submission failed\n' + xhr.response)
                    }
                  } else {
                    history.push('/proposal/' + result.proposalId);
                    alert('Proposal submitted successfully!')
                  }

                } else if (xhr.status == 500) {
                  alert('Internor Error, please inform the devs!\n' + xhr.response);
                } else {
                  alert('Error!\n' + xhr.response);
                }
              }
            }

            xhr.send(
              JSON.stringify({
                signature: signature,
                walletAddress: walletAddress,
                title: data.proposal_title_input,
                description: data.proposal_description_input,
                timestamp: timestamp,
              })
            )
          }
        }
      );

    });



  }

  return (
    <div className="container-xl">
      <div>
    <SubmitProposalContainer className="app-card shadow-sm">
      <div>
        <Heading>Submit Proposal</Heading>
        <div>
          Note: This creates a proposal with "Yes" or "No" as the options. More
          proposal types will be supported in the future.
        </div>
      </div>
      <form id="proposal_form" className="" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group mb-3">
          <label htmlFor="proposal_title_input" className="form-label">Title</label>
          <Input
            type="text"
            {...register("proposal_title_input", { required: true })}
            placeholder=""
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
            placeholder=""
            className="form-control"
          />
          {errors.proposal_description_input?.type === 'required' && "Description is required"}
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </SubmitProposalContainer>
    </div>
  </div>
  )
}
