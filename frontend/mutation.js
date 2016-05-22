import Relay from 'react-relay'

const fragmentMutationPayload = Relay.QL`
   fragment on MutationPayload{
      image {
        id,
        url
     }
}`;

class Mutation extends Relay.Mutation {
    getMutation() {
        return Relay.QL`mutation {uploadProfilePhoto}`;
    }

    getVariables() {
        return {
            clientMutationId: this.props.image['clientMutationId']
        };
    }
    
    getFiles(){
        return {
            file:this.props.image["file"]
        }
    }

    getFatQuery() {
        return fragmentMutationPayload;
    }

    getConfigs() {
        return [
            {
                type: "REQUIRED_CHILDREN",
                children: [fragmentMutationPayload],
            },
            {
                type: 'FIELDS_CHANGE',
                fieldIDs: {
                    image: this.props.image.id,
                },
            }
        ];
    }
    getOptimisticResponse(){
        return {
            error:null
        }
    }
}
export default Mutation;