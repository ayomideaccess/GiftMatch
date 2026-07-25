import { success, ZodError } from "zod";

const validate = (schema) => {
    return (req, res, next) =>{
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    success: false,
                    errors: error.issues.map((issue) => ({
                        field: issue.path.join("."),
                        message: issue.message
                    }))
                })
            }
            next(error);
        }
    }
}
export default validate;