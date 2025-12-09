"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Match = Match;
const class_validator_1 = require("class-validator");
function Match(property, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'Match',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [property],
            validator: {
                validate(value, validationArguments) {
                    const [relatedPropertyName] = validationArguments?.constraints;
                    const relatedValue = (validationArguments?.object)[relatedPropertyName];
                    return value === relatedValue;
                },
            },
        });
    };
}
//# sourceMappingURL=match.decorator.js.map