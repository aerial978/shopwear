<?php

namespace App\Controller\Api\V1;

use App\Repository\ProductRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/v1/products')]
class ProductController extends AbstractController
{
    #[Route('', name: 'api_products_list', methods: ['GET'])]
    public function list(
        Request $request,
        ProductRepository $productRepository,
        SerializerInterface $serializer
    ): JsonResponse {
        // Lecture des query params avec valeurs par défaut
        $page     = max(1, (int) $request->query->get('page', 1));
        $limit    = (int) $request->query->get('limit', 12);
        // Bornage côté contrôleur pour éviter division par zéro et abus
        $limit    = max(1, min(100, $limit));

        $q        = $request->query->get('q');
        $category = $request->query->get('category'); // slug de la catégorie
        $sort     = $request->query->get('sort', 'createdAt');
        $order    = $request->query->get('order', 'desc');

        // Appel du repository (avec filtre de catégorie)
        $result = $productRepository->findPaginatedForCatalogue(
            $page,
            $limit,
            $q,
            $category,
            $sort,
            $order
        );

        $items = $result['items'];
        $total = $result['total'];

        // Calcul pagination (convention MVP)
        $pages = ($total === 0) ? 0 : (int) ceil($total / $limit);

        // Sérialisation avec groupe product:list
        $itemsJson = $serializer->serialize(
            $items,
            'json',
            ['groups' => ['product:list']]
        );

        // Construction réponse finale
        $response = [
            'items' => json_decode($itemsJson, true, 512, JSON_THROW_ON_ERROR),
            'pagination' => [
                'page'  => $page,
                'limit' => $limit,
                'total' => $total,
                'pages' => $pages,
            ],
        ];

        return new JsonResponse($response, JsonResponse::HTTP_OK);
    }
}
