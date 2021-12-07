import { CustomMesages, Rules } from "./types";
import Validator from "./validator";

export default  {
    make: function(data: object = {}, rules: Rules = {}, customMessages: CustomMesages = {}): Validator {
        return new Validator(data, rules, customMessages);
    }
};
