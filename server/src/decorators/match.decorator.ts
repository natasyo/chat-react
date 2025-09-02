import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function Match(property: string, validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'Match',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: any, validationArguments?: ValidationArguments) {
          const [relatedPropertyName] = validationArguments?.constraints as [
            string,
          ];
          const relatedValue = (validationArguments?.object as any)[
            relatedPropertyName
          ];
          console.log(value === relatedValue);
          return value === relatedValue;
        },
      },
    });
  };
}
