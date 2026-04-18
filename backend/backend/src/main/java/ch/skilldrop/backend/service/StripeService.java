package ch.skilldrop.backend.service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.PaymentMethod;
import com.stripe.model.Subscription;
import com.stripe.param.CustomerCreateParams;
import com.stripe.param.PaymentMethodAttachParams;
import com.stripe.param.SubscriptionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class StripeService {

    @Value("${stripe.secret-key}")
    private String secretKey;

    public String createSubscription(String email, String paymentMethodId, String priceId) throws StripeException {
        Stripe.apiKey = secretKey;

        Customer customer = Customer.create(
            CustomerCreateParams.builder()
                .setEmail(email)
                .build()
        );

        PaymentMethod paymentMethod = PaymentMethod.retrieve(paymentMethodId);
        paymentMethod.attach(
            PaymentMethodAttachParams.builder()
                .setCustomer(customer.getId())
                .build()
        );

        Subscription subscription = Subscription.create(
            SubscriptionCreateParams.builder()
                .setCustomer(customer.getId())
                .addItem(
                    SubscriptionCreateParams.Item.builder()
                        .setPrice(priceId)
                        .build()
                )
                .setDefaultPaymentMethod(paymentMethodId)
                .build()
        );

        return subscription.getId();
    }

    public String createPrice(Double amount) throws StripeException {
        Stripe.apiKey = secretKey;

        com.stripe.model.Price price = com.stripe.model.Price.create(
            com.stripe.param.PriceCreateParams.builder()
                .setCurrency("chf")
                .setUnitAmount((long) (amount * 100))
                .setRecurring(
                    com.stripe.param.PriceCreateParams.Recurring.builder()
                        .setInterval(com.stripe.param.PriceCreateParams.Recurring.Interval.MONTH)
                        .build()
                )
                .setProductData(
                    com.stripe.param.PriceCreateParams.ProductData.builder()
                        .setName("SkillDrop Creator Subscription")
                        .build()
                )
                .build()
        );

        return price.getId();
    }
    public String createCheckoutSession(String email, String priceId, Long creatorId) throws StripeException {
        Stripe.apiKey = secretKey;

        com.stripe.model.checkout.Session session = com.stripe.model.checkout.Session.create(
            com.stripe.param.checkout.SessionCreateParams.builder()
                .setMode(com.stripe.param.checkout.SessionCreateParams.Mode.SUBSCRIPTION)
                .setCustomerEmail(email)
                .addLineItem(
                    com.stripe.param.checkout.SessionCreateParams.LineItem.builder()
                        .setPrice(priceId)
                        .setQuantity(1L)
                        .build()
                )
                .setSuccessUrl("https://skilldrop.ch/success")
                .setCancelUrl("https://skilldrop.ch/cancel")
                .putMetadata("creatorId", creatorId.toString())
                .build()
        );

        return session.getUrl();
    }
}