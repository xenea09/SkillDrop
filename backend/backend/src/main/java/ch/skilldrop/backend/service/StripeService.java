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
}