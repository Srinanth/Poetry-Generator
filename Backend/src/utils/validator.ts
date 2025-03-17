import { body, ValidationChain,validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

const validate = (validations: ValidationChain[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        for(let validation of validations){
            const result = await validation.run(req);
            if(!result.isEmpty()){
                break;
            }
            }
            const errors = validationResult(req);
            if(errors.isEmpty()){
                return next();
            }
           return res.status(422).json({message:"Validation Error",errors:errors.array()})
        };
};

const loginvalidator = [
    body("email")
      .notEmpty()
      .withMessage("Email is Required")
      .trim()
      .isEmail()
      .withMessage("Email is not valid"),
    body("password")
      .notEmpty()
      .withMessage("Password is Required")
      .trim()
      .isLength({ min: 6, max: 8 })
      .withMessage(
        "Password must be atleast 6-8 characters long and should not conatin any spaces"
      ),
  ];

const signUpvalidator = [
  body("name")
    .notEmpty()
    .withMessage("Name is Required")
    .isLength({ min: 3, max: 10 })
    .withMessage("Name must be between 3 to 10 characters"),
    ...loginvalidator,
];

const chatCompletionvalidator = [
  body("prompt")
    .notEmpty()
    .withMessage("Message is Required")
];


export { validate,loginvalidator, signUpvalidator,chatCompletionvalidator };
