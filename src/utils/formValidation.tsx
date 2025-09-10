import { useTranslation } from "@/components/TranslationContext";



const urlPattern = /^(http(s)?:\/\/)?[a-zA-Z0-9@:%._+~#=-]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@%_+.~#?&/=]*)$/;

const FormValidation = () => {
  const { t } = useTranslation();
  return {
    couponCode: {
      required: t("PLEASE_ENTER_COUPON_CODE"),
      pattern: {
        value: /^[^\s][A-Za-z0-9]+$/,
        message: t("CANNOT_START_WITH_A_SPACE_AND_USE_ONLY_CAPITAL_LETTERS"),
      },
      minLength: {
        value: 15,
        message: t("MINIMUM_LENGTH_MUST_BE_15"),
      },
    },

    password: {

      required: t("PASSWORD_IS_REQUIRED"),
      validate: {
        whiteSpace: (value) => value.trim() ? true : t('WHITE_SPACES_NOT_ALLOWED')
      },
      pattern: {
        value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};:'"\\|,.<>\/?]).{8,}$/,
        message:
          "Password must contain lowercase,uppercase characters, numbers, special character and must be 8 character long.",
      },
    },

    couponAmount: {
      required: t("PLEASE_ENTER_COUPON_AMOUNT"),
      pattern: {
        value: /^[^\s].*/,
        message: t("CANNOT_START_WITH_A_SPACE"),
      },
    },
    rewardAmount: {
      required: t("PLEASE_ENTER_REWARD_AMOUNT"),
      pattern: {
        value: /^[^\s].*/,
        message: t("CANNOT_START_WITH_A_SPACE"),
      },
    },

    firstName: {
      required: t("PLEASE_ENTER_FIRST_NAME"),
      pattern: {
        value: /^[^\s].*/,
        message: t("CANNOT_START_WITH_A_SPACE"),
      },

      minLength: {
        value: 2,
        message: t("MINIMUM_LENGTH_MUST_BE_2"),
      },
      maxLength: {
        value: 20,
        message: t("MAXIMUM_LENGTH_SHOULD_BE_20_CHARACTERS"),
      },
      validate: {
        whiteSpace: (value) => (value.trim() ? true : t("WHITE_SPACES_NOT_ALLOWED")),
        onlyAlphabets: (value) => /^[a-zA-Z_ ]*$/.test(value) || t("ONLY_ALPHABETS_ARE_ALLOWED"),
      },
    },


    accountHolderName: {
      required: t("PLEASE_ENTER_ACCOUNT_HOLDER_NAME"),
      pattern: {
        value: /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/,
        message: "Invalid SWIFT code format",
      },
      minLength: {
        value: 8,
        message: "SWIFT code must be at least 8 characters",
      },
      maxLength: {
        value: 11,
        message: "SWIFT code must not exceed 11 characters",
      },
    },
    name: {
      required: t("SERVICE_NAME_IS_REQUIRED"),
      pattern: {
        value: /^[^\s].*/,
        message: t("CANNOT_START_WITH_A_SPACE"),
      },
      minLength: {
        value: 2,
        message: t("MINIMUM_LENGTH_MUST_BE_2"),
      },
      maxLength: {
        value: 30,
        message: t("MAXIMUM_LENGTH_CANNOT_GREATER_THAN_30"),
      },
      validate: {
        whiteSpace: (value) => (value.trim() ? true : t("WHITE_SPACES_NOT_ALLOWED")),
      },
    },



    numbersOfCoupon: {
      required: t("PLEASE_ENTER_NUMBER_OF_COUPONS"),
      validate: {
        notGreaterThan100: (value) => parseInt(value, 10) <= 1000 || t("NUMBER_NOT_GREATER_THAN_1000"),
        notLessThan0: (value) => parseInt(value, 10) >= 0 || t("NUMBER_NOT_LESS_THAN_0"),
      },
    },

    subAdminName: {
      required: t("PLEASE_ENTER_FULL_NAME"),
      validate: {
        noSpace: (value) => value.trim() !== "" || t("CANNOT_START_WITH_A_SPACE"),
        onlyAlphabets: (value) => /^[a-zA-Z_ ]*$/.test(value) || t("ONLY_ALPHABETS_ARE_ALLOWED"),
        minLength: (value) => value.length >= 2 || t("MINIMUM_LENGTH_MUST_BE_2_CHARACTERS"),
        maxLength: (value) => value.length <= 20 || t("MAXIMUM_LENGTH_SHOULD_BE_20_CHARACTERS"),
      },
    },
    subAdminLastName: {
      required: t("PLEASE_ENTER_LAST_NAME"),
      validate: {
        noSpace: (value) => value.trim() !== "" || t("CANNOT_START_WITH_A_SPACE"),
        onlyAlphabets: (value) => /^[a-zA-Z_ ]*$/.test(value) || t("ONLY_ALPHABETS_ARE_ALLOWED"),
        minLength: (value) => value.length >= 2 || t("MINIMUM_LENGTH_MUST_BE_2_CHARACTERS"),
        maxLength: (value) => value.length <= 20 || t("MAXIMUM_LENGTH_SHOULD_BE_20_CHARACTERS"),
      },
    },

    lastName: {
      required: t("PLEASE_ENTER_LAST_NAME"),
      pattern: {
        value: /^[^\s].*/,
        message: t("CANNOT_START_WITH_A_SPACE"),
      },
      minLength: {
        value: 2,
        message: t("MINIMUM_LENGTH_MUST_BE_2"),
      },
      maxLength: {
        value: 20,
        message: t("MAXIMUM_LENGTH_SHOULD_BE_20_CHARACTERS"),
      },
      validate: {
        whiteSpace: (value) => (value.trim() ? true : t("WHITE_SPACES_NOT_ALLOWED")),
        onlyAlphabets: (value) => /^[a-zA-Z_ ]*$/.test(value) || t("ONLY_ALPHABETS_ARE_ALLOWED"),
      },
    },

    siteName: {
      required: t("PLEASE_ENTER_SITE_NAME"),
      pattern: {
        value: /^[^\s].*/,
        message: t("CANNOT_START_WITH_A_SPACE"),
      },
      minLength: {
        value: 2,
        message: t("MINIMUM_LENGTH_MUST_BE_2"),
      },
      maxLength: {
        value: 20,
        message: t("MAXIMUM_LENGTH_SHOULD_BE_20_CHARACTERS"),
      },
      validate: {
        whiteSpace: (value) => (value.trim() ? true : t("WHITE_SPACES_NOT_ALLOWED")),
        onlyAlphabets: (value) => /^[a-zA-Z_ ]*$/.test(value) || t("ONLY_ALPHABETS_ARE_ALLOWED"),
      },
    },


    companyName: {
      required: t("PLEASE_ENTER_COMPANY_NAME"),
      pattern: {
        value: /^[^\s].*/,
        message: t("CANNOT_START_WITH_A_SPACE"),
      },
      minLength: {
        value: 2,
        message: t("MINIMUM_LENGTH_MUST_BE_2"),
      },
      maxLength: {
        value: 20,
        message: t("MAXIMUM_LENGTH_SHOULD_BE_20_CHARACTERS"),
      },
      validate: {
        whiteSpace: (value) => (value.trim() ? true : t("WHITE_SPACES_NOT_ALLOWED")),
        onlyAlphabets: (value) => /^[a-zA-Z_ ]*$/.test(value) || t("ONLY_ALPHABETS_ARE_ALLOWED"),
      },
    },


    facebookLink: {
      required: {
        value: true,
        message: t("PLEASE_ENTER_FB_URL"),
      },

      pattern: {
        value: urlPattern,
        message: t("PLEASE_ENTER_VALID_FACEBOOK_URL"),
      },
    },
    instagramLink: {
      required: {
        value: true,
        message: t("PLEASE_ENTER_INSTAGRAM_URL"),
      },
      pattern: {
        value: urlPattern,
        message: t("PLEASE_ENTER_VALID_INSTAGRAM_URL"),
      },
    },

    twitterLink: {
      required: {
        value: true,
        message: t("PLEASE_ENTER_TWITTER_URL"),
      },
      pattern: {
        value: urlPattern,
        message: t("PLEASE_ENTER_VALID_TWITTER_URL"),
      },
    },

    youtubeLink: {
      required: {
        value: true,
        message: t("PLEASE_ENTER_YOUTUBE_URL"),
      },
      pattern: {
        value: urlPattern,
        message: t("PLEASE_ENTER_VALID_YOUTUBE_URL"),
      },
    },

    linkedinLink: {
      required: {
        value: true,
        message: t("PLEASE_ENTER_LINKEDIN_URL"),
      },
      pattern: {
        value: urlPattern,
        message: t("PLEASE_ENTER_VALID_LINKEDIN_URL"),
      },
    },


    nationalityId: {
      required: t("PLEASE_ENTER_NATIONALITY_ID"),
      pattern: {
        value: /^[^\s].*/,
        message: t("CANNOT_START_WITH_A_SPACE"),
      },
      minLength: {
        value: 2,
        message: t("MINIMUM_LENGTH_MUST_BE_2"),
      },
      maxLength: {
        value: 20,
        message: t("MAXIMUM_LENGTH_SHOULD_BE_20_CHARACTERS"),
      },
      validate: {
        whiteSpace: (value) => (value.trim() ? true : t("WHITE_SPACES_NOT_ALLOWED")),
      },
    },
    email: {
      required: t("PLEASE_ENTER_EMAIL_ID"),
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: t("INVALID_EMAIL_ADDRESS"),
      },
      validate: {
        whiteSpace: (value) => (value.trim() ? true : t("WHITE_SPACES_NOT_ALLOWED")),
      },
    },
    subject: {
      required: t("PLEASE_ENTER_SUBJECT"),
      minLength: {
        value: 2,
        message: t("SUBJECT_SHOULD_CONTAIN_AT_LEAST_2_CHARACTERS"),
      },
      maxLength: {
        value: 500,
        message: t("SUBJECT_SHOULD_NOT_EXCEED_500_CHARACTERS"),
      },
      validate: {
        whiteSpace: (value) => (value.trim() ? true : t("WHITE_SPACES_NOT_ALLOWED")),
      },
    },
    mobile: {
      required: t("PLEASE_ENTER_MOBILE_NUMBER"),
      minLength: {
        value: 10,
        message: "Minimum length should be 10 digits.",
      },
      min: {
        value: 0,
        message: "Minimum value must is 0.",
      },
      maxLength: {
        value: 10,
        message: "Maximum length should be 10 digits.",
      },
    },
    description: {
      required: "Description is required.",
      minLength: {
        value: 10,
        message: "Description should contains at least 10 characters.",
      },
      maxLength: {
        value: 350,
        message: "Description should not exceed 350 characters.",
      },
      validate: {
        whiteSpace: (value) => (value.trim() ? true : t("WHITE_SPACES_NOT_ALLOWED")),
      },
    },


    question: {
      required: "Question is required.",
      minLength: {
        value: 2,
        message: "Question should contains at least 2 characters.",
      },
      maxLength: {
        value: 300,
        message: "Question should not exceed 300 characters.",
      },
      validate: {
        whiteSpace: (value) => (value.trim() ? true : t("WHITE_SPACES_NOT_ALLOWED")),
      },
    },

    descriptionProduct: {
      required: "Please enter description.",
      minLength: {
        value: 3,
        message: "Description should contains at least 3 characters.",
      },
      maxLength: {
        value: 100,
        message: "Description should not exceed 100 characters.",
      },
      validate: {
        whiteSpace: (value) => (value.trim() ? true : t("WHITE_SPACES_NOT_ALLOWED")),
      },
    },
    title: {
      required: t("PLEASE_ENTER_TITLE"),
      minLength: {
        value: 2,
        message: "Title should contains at least 2 characters.",
      },
      maxLength: {
        value: 100,
        message: "Title should not exceed 100 characters.",
      },
      validate: {
        whiteSpace: (value) => (value.trim() ? true : t("WHITE_SPACES_NOT_ALLOWED")),
      },
    },

    metaTitle: {
      required: t("PLEASE_ENTER_META_TITLE"),
      minLength: {
        value: 2,
        message: "Meta title should contains at least 2 characters.",
      },
      maxLength: {
        value: 100,
        message: "Meta title should not exceed 100 characters.",
      },
      validate: {
        whiteSpace: (value) => (value.trim() ? true : t("WHITE_SPACES_NOT_ALLOWED")),
      },
    },
    metaKeyword: {
      required: t("PLEASE_ENTER_META_KEYWORD"),
      minLength: {
        value: 2,
        message: "Meta keyword should contains at least 2 characters.",
      },
      maxLength: {
        value: 100,
        message: "Meta keyword should not exceed 100 characters.",
      },
      validate: {
        whiteSpace: (value) => (value.trim() ? true : t("WHITE_SPACES_NOT_ALLOWED")),
      },
    },
    metaDescription: {
      required: t("PLEASE_ENTER_META_DESCRIPTION"),
      minLength: {
        value: 2,
        message: "Meta description should contains at least 2 characters.",
      },
      maxLength: {
        value: 100,
        message: "Meta description should not exceed 100 characters.",
      },
      validate: {
        whiteSpace: (value) => (value.trim() ? true : t("WHITE_SPACES_NOT_ALLOWED")),
      },
    },
    address: {
      required: "Please enter address.",
      minLength: {
        value: 10,
        message: "Address should contains at least 10 characters.",
      },
      maxLength: {
        value: 250,
        message: "Address should not exceed 250 characters.",
      },
      validate: {
        whiteSpace: (value) => (value.trim() ? true : t("WHITE_SPACES_NOT_ALLOWED")),
      },
    },
    linkValidation: {
      validate: {
        isValidLink: (value) => {
          if (!value) return true; // Skip validation if the field is empty
          const urlPattern = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+(com|in)(\/[^\s]*)?$/;
          const noMiddleOrLeadingSpaces = /^[^\s]+(\s*)$/;
          return (urlPattern.test(value) && noMiddleOrLeadingSpaces.test(value)) || t("PLEASE_ENTER_VALID_LINK");
        },
      },
    },
    offerName: {
      required: t("OFFER_NAME_IS_REQUIRED"),
      pattern: {
        value: /^[^\s].*/,
        message: t("CANNOT_START_WITH_A_SPACE"),
      },
      minLength: {
        value: 2,
        message: t("MINIMUM_LENGTH_MUST_BE_2"),
      },
      maxLength: {
        value: 30,
        message: t("MAXIMUM_LENGTH_CANNOT_GREATER_THAN_30"),
      },
      validate: {
        whiteSpace: (value) => (value.trim() ? true : t("WHITE_SPACES_NOT_ALLOWED")),
      },
    },
    discountType: {
      required: t("DISCOUNT_TYPE_IS_REQUIRED")
    },
    discountValue: {
      required: t("DISCOUNT_VALUE_IS_REQUIRED"),
      pattern: {
        value: /^[^\s].*/,
        message: t("CANNOT_START_WITH_A_SPACE"),
      },
      minLength: {
        value: 1,
        message: t("MINIMUM_LENGTH_MUST_BE_2"),
      },
      maxLength: {
        value: 10,
        message: t("MAXIMUM_LENGTH_CANNOT_GREATER_THAN_10"),
      },
      validate: {
        whiteSpace: (value) => (value.trim().length > 0 ? true : t("WHITE_SPACES_NOT_ALLOWED")),
        numeric: (value) => {
          const isValidNumber = /^\d+(\.\d{1,2})?$/.test(value);
          return isValidNumber || t("DISCOUNT_VALUE_MUST_BE_A_VALID_NUMBER");
        }
      }

    },
    startDate: {
      required: "Start date is required"
    },
    endDate: {
      required: "End Date is required"
    },
    code: {
      required: t('OFFER_CODE_IS_REQUIRED'),
      pattern: {
        value: /^[a-zA-Z0-9]+$/,
        message: t('ONLY_ALPHANUMERIC_CHARACTERS_ARE_ALLOWED'),
      },
    },
    limit: {
      required: t('USAGE_LIMIT_IS_REQUIRED'),
      pattern: {
        value: /^[1-9]\d*$/,
        message: t('LIMIT_MUST_BE_A_POSITIVE_INTEGER'),
      },
    },
    eligibility: {
      required: t('ELIGIBILITY_IS_REQUIRED')
    }
  };
};

export default FormValidation;
