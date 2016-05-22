import Relay from 'react-relay'

const ImageMutationPayload = Relay.QL`
   fragment on ImageMutationPayload{
      image {
        id,
        url
     }
}`;

class Mutation extends Relay.Mutation {
    getMutation() {
        return Relay.QL`mutation {image}`;
    }

    getVariables() {
        return {
            title: this.props.image['title'],
            clientMutationId: this.props.image['clientMutationId']
        };
    }
    
    getFiles(){
        return {
            file:this.props.image["file"]
        }
    }

    getFatQuery() {
        return ImageMutationPayload;
    }

    getConfigs() {
        return [
            {
                type: "REQUIRED_CHILDREN",
                children: [ImageMutationPayload],
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